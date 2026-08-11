import * as functions from 'firebase-functions';
import * as express from 'express';
import * as https from 'https';
import * as cors from 'cors';
require('dotenv').config();

const app: express.Application = express();
app.use(cors());

const googleApiKey = process.env.GOOGLE_KEY;

function proxyGoogleApi(
  path: string,
  params: Record<string, string>,
  response: express.Response,
  cacheSeconds?: number,
) {
  const searchParams = new URLSearchParams({ ...params, key: googleApiKey || '' });
  const url = `https://maps.googleapis.com/maps/api/${path}?${searchParams.toString()}`;

  https.get(url, (res) => {
    res.setEncoding('utf8');
    let body = '';
    res.on('data', data => {
      body += data;
    });
    res.on('end', () => {
      if (cacheSeconds) {
        response.set('Cache-Control', `public, max-age=${cacheSeconds}`);
      }
      response.send(JSON.parse(body));
    });
  }).on('error', (error) => {
    console.error(error);
    response.status(502).send({ error: 'Upstream request failed' });
  });
}

app.get('/places', (request: express.Request, response: express.Response) => {
  proxyGoogleApi('place/nearbysearch/json', {
    location: String(request.query.location || ''),
    radius: String(request.query.radius || '5000'),
    type: String(request.query.type || ''),
    keyword: String(request.query.keyword || ''),
  }, response, 300);
});

app.get('/places/details', (request: express.Request, response: express.Response) => {
  proxyGoogleApi('place/details/json', {
    place_id: String(request.query.placeid || ''),
  }, response, 3600);
});

app.get('/geocode', (request: express.Request, response: express.Response) => {
  const location = String(request.query.location || '');
  const isLatLng = /^-?\d+\.?\d*,-?\d+\.?\d*$/.test(location);
  const params = isLatLng ? { latlng: location } : { address: location };

  proxyGoogleApi('geocode/json', params, response, 3600);
});

export const api = functions.https.onRequest(app);
