// Generic async reusable function
export async function moveToFirstAsync(arr, matchFn) {
  for (let i = 0; i < arr.length; i++) {
    const isMatch = await matchFn(arr[i], i, arr);
    if (isMatch) {
      const newArr = [...arr];
      const [item] = newArr.splice(i, 1);
      newArr.unshift(item);
      return newArr;
    }
  }

  return arr;
}
