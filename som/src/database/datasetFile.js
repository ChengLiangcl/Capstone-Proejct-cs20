// 因为HTTP传过来的 attribute 直接是 name, size， 建议直接使用，无需另外取名为, 如file_name, file_size
// 否则后期会涉及到 Hashmap的key值转换问题，导致不必要的工作量增加
export const DATASET = [
    {
        name: null,
        size: null
    }
];
