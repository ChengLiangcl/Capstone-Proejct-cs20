import {metadata1, metadata2, model1, model2} from './testCompareData';
import compareProps from './compareProps';

test('compare same prev and current data in the metadata', () => {
    expect(compareProps(metadata1, metadata1, model1, model1)).toBe(false);
});

test('compare different prev and current data in the metadata', () => {
    expect(compareProps(metadata1, metadata2, model1, model2)).toBe(true);
    expect(compareProps(metadata1, metadata1, model1, model2)).toBe(true);
    expect(compareProps(metadata1, metadata2, model1, model1)).toBe(true);
});