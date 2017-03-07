// config/database.js
module.exports = {
    'url': 'mongoContact:27017', // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
    'contactDB': 'mongoContact:27017/contactsDB',
    //'globlaRegistryUrl' : 'http://161.106.2.20:5002',
    'globlaRegistryUrl': 'https://greg.rethink3.orange-labs.fr',
    //'globlaRegistryUrl' : 'http://130.149.22.133', 
    //'globlaRegistryPort' : '5002',
    'proxy': '',
    'domainRegistryUrl': 'https://acor-webrtc.rethink2.orange-labs.fr/registry/',
    'webRTCUrl': 'https://acor-webrtc.rethink2.orange-labs.fr/'

};