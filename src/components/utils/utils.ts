function isInList(haystack: any, needle: any) {
  for (const item of haystack) {
    if (item.data.name === needle.data.name) {
      return true;
    }
  }

  return false;
}

export { isInList };
