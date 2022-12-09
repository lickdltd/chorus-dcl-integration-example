import { signedFetch } from '@decentraland/SignedFetch'
import * as utils from '@dcl/ecs-scene-utils'

export class Chorus {
  private readonly _entity: Entity
  private readonly _stream: string
  private readonly _interval: number

  private static URL = 'https://chorus.lickd.co'

  public constructor(entity: Entity, stream: string, interval: number = 60000) {
    this._entity = entity
    this._stream = stream
    this._interval = interval
  }

  public async start() {
    try {
      const response = await signedFetch(Chorus.URL + '/api/session/create/dcl', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          stream: this._stream
        })
      })

      const json = await JSON.parse(response.text || '{}')

      if (json.token) {
        this._entity.addComponent(new AudioStream(Chorus.URL + this._stream + '?token=' + json.token))
        this._entity.addComponent(new utils.Interval(this._interval, async () => await this.heartbeat(json.token)))
      }
    } catch (e) {
      log(e)
    }
  }

  public async stop() {
    this._entity.removeComponent(AudioStream)
    this._entity.removeComponent(utils.Interval)
  }

  private async heartbeat(token: string) {
    let active = false

    try {
      const response = await signedFetch(Chorus.URL + '/api/session/heartbeat/dcl', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ token })
      })

      active = response.status === 200
    } catch (e) {
      log(e)
    }

    if (!active) {
      await this.stop()
    }
  }
}
