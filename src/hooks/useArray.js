import { useState } from "react";

export default function useArray(defaultValue) {
  const [array, setArray] = useState(defaultValue);

  function push(element) {
    setArray((a) => [...a, element]);
  }

  function set(newArray) {
    setArray(newArray);
  }

  function filter(callback) {
    setArray((a) => a.filter(callback));
  }

  function update(index, newElement) {
    let temp = array.slice();
    temp[index] = newElement;
    setArray(temp);
  }

  function remove(index) {
    setArray((a) => [...a.slice(0, index), ...a.slice(index + 1, a.length)]);
  }

  function clear() {
    setArray([]);
  }

  const arrayMethods = {
    push: push,
    set: set,
    filter: filter,
    update: update,
    remove: remove,
    clear: clear,
  };

  return [array, arrayMethods];
}
