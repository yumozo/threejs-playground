import { TileObject, TileType } from "@game/game_objects/tile-object";
import { ModelLoader } from "../model-loader";

describe("ModelLoader", () => {
  describe('getTileModel()', () => {
    it('should return the correct tile model', async () => {
      const modelLoader = ModelLoader.getInstance();
      await modelLoader.loadTiles();

      const expectedModel = modelLoader['tileModels'].get(TileType.Grass);
      const actualModel = modelLoader.getTileModel(TileType.Grass);

      expect(actualModel).toBe(expectedModel);
    });

    it('should return undefined for an unknown tile type', async () => {
      const modelLoader = ModelLoader.getInstance();
      await modelLoader.loadTiles();

      const actualModel = modelLoader.getTileModel('unknown' as TileType);

      expect(actualModel).toBeUndefined();
    });
  });
})

function getModelPath(type: TileType): string {
  switch (type) {
    case TileType.Ground:
      return 'floor.glb';
    case TileType.Grass:
      return 'grass.glb';
    case TileType.Water:
      return 'water.glb';
    case TileType.Dirt:
      return 'dirt.glb';
  }
}