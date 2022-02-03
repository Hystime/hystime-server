import * as fs from 'fs';
import { isDebug } from './utils';
import { Db } from './db/db';

import * as faker from 'faker';
import { TargetType, TimePieceType } from './generated/types';
import { getConnection } from 'typeorm';
import { UserEntity } from './entities/user';

async function isDatabaseEmpty(): Promise<boolean> {
  const result = await getConnection().getRepository(UserEntity).count();
  return result === 0;
}

export async function createDebugData(): Promise<void> {
  if (!isDebug()) {
    return;
  }
  if (!(await isDatabaseEmpty())) {
    return;
  }

  console.info('Creating fake data.');

  const user = await Db.createUser({
    targets: undefined,
    username: 'Zxilly',
  });

  const targets: string[] = [];
  let i = 10;
  while (i--) {
    try {
      const target = await Db.createTarget(user.id, {
        name: faker.lorem.word(),
        timePieces: undefined,
        timeSpent: faker.datatype.number({
          min: 0,
          max: 60 * 24 * 1000,
        }),
        type: faker.helpers.randomize([TargetType.Normal, TargetType.Longterm]),
      });
      target && target.id && targets.push(target.id);

      console.info(`Create target ${target.name}`);
    } catch (e: any) {
      console.error(e);
      i++;
    }
  }

  targets.forEach((id) => {
    let i = 100;
    while (i--) {
      try {
        Db.createTimePiece(id, {
          duration: faker.datatype.number({
            min: 60,
            max: 60 * 60 * 2,
          }),
          type: faker.helpers.randomize([TimePieceType.Normal, TimePieceType.Pomodoro]),
          start: faker.date.recent(14),
        });
      } catch (e: any) {
        console.error(e);
        i++;
      }
    }
    console.info(`Create 100 timepieces for ${id}`);
  });
}
