const { Op } = require("sequelize");

async function queryDatabase({
  model,
  pagination = {},
  sort = {},
  search = {},
  filters = {},
  include = [],
  additionalWhere = {},
}) {
  const where = { ...additionalWhere };

  // ---- 🔍 SEARCH ----
  if (search?.query && search?.fields?.length) {
    const orConditions = [];

    for (const field of search.fields) {
      if (field.includes(".")) {
        orConditions.push({
          [`$${field}$`]: { [Op.like]: `%${search.query}%` },
        });
      } else {
        orConditions.push({
          [field]: { [Op.like]: `%${search.query}%` },
        });
      }
    }

    if (orConditions.length) {
      where[Op.and] = where[Op.and] || [];
      where[Op.and].push({ [Op.or]: orConditions });
    }
  }

  // ---- 🎯 FILTERS ----
  if (filters && typeof filters === "object") {
    for (const [key, value] of Object.entries(filters)) {
      if (Array.isArray(value)) {
        where[key] = { [Op.or]: value };
      } else if (typeof value === "object" && (value.from || value.to)) {
        const fromDate = value.from ? new Date(value.from) : null;
        const toDate = value.to ? new Date(value.to) : null;
        if (toDate) toDate.setHours(23, 59, 59, 999);
        where[key] = {
          [Op.between]: [fromDate, toDate].filter(Boolean),
        };
      } else {
        where[key] = value;
      }
    }
  }

  // ---- 📄 PAGINATION ----
  const limit = Number(pagination?.limit) || 10;
  const page = Number(pagination?.page) || 1;
  const offset = (page - 1) * limit;

  const rawAttrs = model.rawAttributes || {};
  const normalizeDir = (d) => ((d || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC");

  let order;
  if (sort?.customSort) {
    order = sort.customSort;
  } else if (Array.isArray(sort) && sort.length > 0) {
    // Több rendezési szint: [{ column: "isPinned", direction: "desc" }, { column: "createdAt", direction: "desc" }]
    order = sort
      .filter((s) => s && s.column && rawAttrs[s.column])
      .map((s) => [s.column, normalizeDir(s.direction)]);
    if (order.length === 0) order = [["createdAt", "DESC"]];
    order.push(["id", "DESC"]);
  } else if (sort?.column && rawAttrs[sort.column]) {
    order = [
      [sort.column, normalizeDir(sort.direction)],
      ["id", "DESC"],
    ];
  } else {
    const sortField = sort?.column && rawAttrs[sort.column] ? sort.column : "createdAt";
    order = [
      [sortField, normalizeDir(sort?.direction)],
      ["id", "DESC"],
    ];
  }

  // 1️⃣ Egyedi ID-k lekérése
  const idResults = await model.findAll({
    attributes: ["id"],
    where,
    include,
    subQuery: false,
    order,
    raw: true,
  });

  const uniqueIds = [...new Set(idResults.map((r) => r.id))];
  const paginatedIds = uniqueIds.slice(offset, offset + limit);
  const total = uniqueIds.length;

  // 2️⃣ Lekérés ID alapján
  const rows = await model.findAll({
    where: { id: { [Op.in]: paginatedIds } },
    include,
    order,
  });

  return {
    data: rows,
    pagination: {
      total,
      limit,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}

module.exports = queryDatabase;
