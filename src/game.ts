import { getUserData } from '@decentraland/Identity'
import { signedFetch } from '@decentraland/SignedFetch'
import * as utils from '@dcl/ecs-scene-utils'

const stationURL = 'https://chorus.lickd.co'
const stream = '/lickd/test.mp3'

void executeTask(async () => {
  const me = await getUserData()

  onEnterSceneObservable.add(async (player) => {
    if (player.userId === me?.userId) {
      await radioStart()
    }
  })
})

async function radioStart() {
  try {
    const response = await signedFetch(stationURL + '/api/session/create/dcl', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ stream })
    })

    if (response.text) {
      const json = await JSON.parse(response.text)

      if (json.token) {
        const streamSource = new Entity()
        const audioStream = new AudioStream(stationURL + stream + '?token=' + json.token)

        streamSource.addComponent(audioStream)
        streamSource.addComponent(new utils.Interval(60000, async () => await heartbeat(json.token)))

        engine.addEntity(streamSource)
      }
    }
  } catch (e) {
    log(e)
  }
}

async function heartbeat(token: string) {
  try {
    await signedFetch(stationURL + '/api/session/heartbeat/dcl', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ stream, token })
    })
  } catch (e) {
    log(e)
  }
}
