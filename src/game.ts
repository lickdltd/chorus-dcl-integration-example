import { Chorus } from './chorus'
import { getUserData } from '@decentraland/Identity'

void executeTask(async () => {
  const chorusEntity = new Entity()
  const chorus = new Chorus(chorusEntity, '/genre/chill.mp3', 10000)
  const me = await getUserData()

  onEnterSceneObservable.add(async (player) => {
    if (player.userId === me?.userId) {
      await chorus.start()
    }
  })

  onLeaveSceneObservable.add(async (player) => {
    if (player.userId === me?.userId) {
      await chorus.stop()
    }
  })

  engine.addEntity(chorusEntity)
})
