const removeEmptyValues = <K extends PropertyKey, V extends string>(
  obj: Record<K, V>
): Partial<Record<K, V>> => Object.fromEntries<V>(Object.entries<V>(obj).filter(entry =>
    entry[1].trim().length > 0)) as Partial<Record<K, V>>

export default removeEmptyValues
