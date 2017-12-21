import {} from 'jest';
import { getListContent, addItem } from '../../src/service/fixture-util';
import { Manufacturer, ManufacturerAttributes } from 'data-shape-ng';

const M_F_N = "manufacturers";

describe("should manual fixtures.", () => {
  it("should return manufacturers.", () => {
      const lb = getListContent(M_F_N, {offset: 0, limit: 10});
      expect(lb.data.length).toBe(10);
      const manufacturers: Manufacturer[] = lb.data as Manufacturer[];
      expect(manufacturers[0].type).toBe(M_F_N);
  });
  it("should convert to number.", () => {
    const s = "123";
    const n: number = +s;
    expect(n).toBe(123);
  });
  it("should get item from array.", () => {
    const l = [1, 2, 3, 4];
    expect(l[-1]).toBe(undefined);
  });
  it("should add a manufacturer.", () => {
      let lb = getListContent("manufacturers");
      const len = lb.data.length;
      addItem(M_F_N, new Manufacturer(new ManufacturerAttributes()));
      lb = getListContent(M_F_N);
      expect(lb.data.length).toBe(len + 1);
      const maxId: number = +lb.data[lb.data.length - 1].id;
      addItem(M_F_N, new Manufacturer(new ManufacturerAttributes()));
      lb = getListContent(M_F_N);
      expect(+lb.data[lb.data.length - 1].id).toBe(maxId + 1);
  });
});