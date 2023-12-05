import { getGroups } from '../../helpers/get-groups';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): PuzzleResult {
    const data = this.getSeedsAndMaps();
    let lowestLocation: number;

    data.seeds.forEach((seed) => {
      const result = this.processSeed(data.maps, seed);
      if (!lowestLocation || result < lowestLocation) {
        lowestLocation = result;
      }
    });

    return lowestLocation;
  }

  public solveSecond(): PuzzleResult {
    const data = this.getSeedsAndMaps();
    let lowestLocation: number;

    const seedRanges: SeedRange[] = [];
    for (let i = 0; i < data.seeds.length; i += 2) {
      seedRanges.push({
        start: data.seeds[i],
        length: data.seeds[i + 1],
      });
    }

    const reversedMaps = data.maps.reverse();
    for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
      const result = this.getSeedFromLocation(reversedMaps, i);
      if (this.doesSeedExist(seedRanges, result)) {
        lowestLocation = i;
        break;
      }
    }

    return lowestLocation;
  }

  private getSeedFromLocation(maps: Map[], location: number) {
    let value = location;
    maps.forEach((map) => {
      for (const range of map.ranges) {
        if (
          value >= range.destination &&
          value < range.destination + range.length
        ) {
          const diff = value - range.destination;
          value = range.source + diff;
          break;
        }
      }
    });

    return value;
  }

  private doesSeedExist(seedRanges: SeedRange[], seed: number) {
    return seedRanges.some(
      (range) => seed >= range.start && seed < range.start + range.length
    );
  }

  private processSeed(maps: Map[], seed: number) {
    let value = seed;
    maps.forEach((map) => {
      for (const range of map.ranges) {
        if (value >= range.source && value < range.source + range.length) {
          const diff = value - range.source;
          value = range.destination + diff;
          break;
        }
      }
    });

    return value;
  }

  private getSeedsAndMaps(): SeedsWithMaps {
    const groups = getGroups(this.input);
    const seeds = groups[0]
      .split('seeds: ')[1]
      .split(' ')
      .map((str) => parseInt(str, 10));

    const maps = groups.splice(1).map((mapStr) => {
      const ranges: Range[] = [];
      mapStr
        .split(':')[1]
        .split('\n')
        .filter(Boolean)
        .forEach((range) => {
          const parts = range.split(' ').map((str) => parseInt(str, 10));
          ranges.push({
            destination: parts[0],
            source: parts[1],
            length: parts[2],
          });
        });

      return { ranges };
    });

    return { seeds, maps };
  }
}

interface Map {
  ranges: Range[];
}

interface Range {
  source: number;
  destination: number;
  length: number;
}

interface SeedsWithMaps {
  seeds: number[];
  maps: Map[];
}

interface SeedRange {
  start: number;
  length: number;
}
