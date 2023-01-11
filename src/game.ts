import { getUserData } from '@decentraland/Identity'
import * as chorus from '@lickdltd/chorus-dcl'

void executeTask(async () => {
  const chorusEntity = new Entity()
  const chorusPlayer = new chorus.Player(chorusEntity, '/lickd/test.mp3')
  const me = await getUserData()

  await chorusPlayer.start()

  onEnterSceneObservable.add(async (player) => {
    if (player.userId === me?.userId) {
      await chorusPlayer.start()
    }
  })

  onLeaveSceneObservable.add(async (player) => {
    if (player.userId === me?.userId) {
      await chorusPlayer.stop()
    }
  })

  engine.addEntity(chorusEntity)
})
