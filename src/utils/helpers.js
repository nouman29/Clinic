export const generateId = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const deepClone = (value) => JSON.parse(JSON.stringify(value));

export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString();
};

