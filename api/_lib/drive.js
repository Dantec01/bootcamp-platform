const { google } = require('googleapis');
const fs = require('fs');
const { requiredEnv } = require('./auth');

function buildAuth() {
  if (process.env.GOOGLE_OAUTH_CLIENT_ID && process.env.GOOGLE_OAUTH_CLIENT_SECRET && process.env.GOOGLE_OAUTH_REFRESH_TOKEN) {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      process.env.GOOGLE_OAUTH_REDIRECT_URI || 'https://developers.google.com/oauthplayground'
    );
    auth.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN });
    return auth;
  }
  let credentials;
  try {
    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON_FILE) {
      credentials = JSON.parse(fs.readFileSync(process.env.GOOGLE_SERVICE_ACCOUNT_JSON_FILE, 'utf8'));
    } else {
      credentials = JSON.parse(requiredEnv('GOOGLE_SERVICE_ACCOUNT_JSON'));
    }
  } catch { throw new Error('No se pudo leer una credencial válida de Google.'); }
  return new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/drive'] });
}

function driveClient() {
  return google.drive({ version: 'v3', auth: buildAuth() });
}

async function getAccessToken() {
  const auth = buildAuth();
  const result = await auth.getAccessToken();
  const token = typeof result === 'string' ? result : result?.token;
  if (!token) throw new Error('No se pudo obtener un token de acceso de Google.');
  return token;
}

function rootFolderId() { return requiredEnv('GOOGLE_DRIVE_ROOT_FOLDER_ID'); }

async function findOrCreateFolder(drive, name, parentId) {
  const escaped = name.replace(/'/g, "\\'");
  const found = await drive.files.list({ q: `name='${escaped}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`, fields: 'files(id)' });
  if (found.data.files?.[0]) return found.data.files[0].id;
  const created = await drive.files.create({ requestBody: { name, mimeType: 'application/vnd.google-apps.folder', parents: [parentId] }, fields: 'id' });
  return created.data.id;
}

async function getCourseFile(drive) {
  const parent = rootFolderId();
  const found = await drive.files.list({ q: `name='course.json' and '${parent}' in parents and trashed=false`, fields: 'files(id)' });
  return found.data.files?.[0]?.id || null;
}

async function readCourse() {
  const drive = driveClient();
  const id = await getCourseFile(drive);
  if (!id) return null;
  const response = await drive.files.get({ fileId: id, alt: 'media' }, { responseType: 'text' });
  return JSON.parse(response.data);
}

async function writeCourse(course) {
  const drive = driveClient();
  const id = await getCourseFile(drive);
  const media = { mimeType: 'application/json', body: JSON.stringify(course, null, 2) };
  if (id) await drive.files.update({ fileId: id, media });
  else await drive.files.create({ requestBody: { name: 'course.json', parents: [rootFolderId()], mimeType: 'application/json' }, media });
}

module.exports = { driveClient, findOrCreateFolder, getAccessToken, readCourse, rootFolderId, writeCourse };