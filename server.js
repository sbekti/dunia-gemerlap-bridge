import Milight from 'milight'
import mqtt from 'mqtt'

const milight = new Milight({
  host: '192.168.0.122',
  broadcast: true
})

const client = mqtt.connect('mqtt://test.mosquitto.org')

client.on('connect', () => {
  client.subscribe('bekti_dugem_color')
  client.subscribe('bekti_dugem_control')
  client.subscribe('bekti_dugem_reqaddr')
  console.log('Connected to MQTT server')
})

client.on('message', (topic, data) => {

  const message = JSON.parse(data.toString())
  const timestamp = new Date().toISOString()

  switch (topic) {

    case 'bekti_dugem_color':
      const color = message.data
      milight.zone(1).rgb(`#${color}`)
      console.log(`[${timestamp}] COLOR ${color} ${message.ip} ${message.ua}`)
      break

    case 'bekti_dugem_control':
      const command = message.data
      console.log(`[${timestamp}] CONTROL ${command} ${message.ip} ${message.ua}`)

      switch (command) {
        case 'on':
          milight.zone(1).white(100)
          break
        case 'off':
          milight.off()
          break
      }

      break

  }

})

console.log('Server started')
