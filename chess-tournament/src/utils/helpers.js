export const formatName = (value = '') => value.trim().replace(/\s+/g, ' ');

export const isEmpty = (value) => value === null || value === undefined || value === '';
