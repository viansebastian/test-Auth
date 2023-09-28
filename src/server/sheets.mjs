import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';


const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

const jwt = new JWT({
  email: process.env.CLIENT_EMAIL,
  key: process.env.PRIMARY_KEY.split(String.raw`\n`).join('\n'),
  scopes: SCOPES,
});

//Sheet indexes 
const inOutIndex = 0; 
const toolsIndex = 1; 
const visitorsdbIndex = 8; 


//In Out Sheet 
export async function addRowToSheet(date, name, nim, action, time) {
  const correctedAction = actionCheck(action); 
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_LINK, jwt);
  await doc.loadInfo(); 
  const sheet = doc.sheetsByIndex[inOutIndex]; 
  await sheet.addRow({ Date: date, Name: name, NIM: nim, Action: correctedAction, Time: time });
}

//Tools Sheet
export async function addRowToSheet2(nim, name, tools) {
  const doc = new GoogleSpreadsheet('1GTvhgEHVrt_YloDFUd66hDHiuqar0EIWA07_IDMcnBk', jwt);
  await doc.loadInfo(); 
  const sheet = doc.sheetsByIndex[toolsIndex]; 
  await sheet.addRow({ NIM: nim, Name: name, Tools: tools });
}

// to rename a sheet 
export async function renameSheet(new_sheet_name, index){
  const doc = new GoogleSpreadsheet('1GTvhgEHVrt_YloDFUd66hDHiuqar0EIWA07_IDMcnBk', jwt);
  await doc.loadInfo(); 
  const sheet = doc.sheetsByIndex[index]; 
  await sheet.updateProperties({ title: new_sheet_name });
}

// to add a visitor
export async function visitorCheck(id, name, status) {
  const doc = new GoogleSpreadsheet('1GTvhgEHVrt_YloDFUd66hDHiuqar0EIWA07_IDMcnBk', jwt);
  await doc.loadInfo(); 
  const sheet = doc.sheetsByIndex[visitorsdbIndex]; 

  const idCheck = await findID(sheet, id); 
  if (idCheck) {
    return;
  }

  await sheet.addRow({ ID: id, Name: name, Status: status});
}

async function findID(sheet, id){
  await sheet.loadHeaderRow();
  const rows = await sheet.getRows();

  // console.log(rows[0]['_rawData'][0]);
  // rows[0] = the index of row 
  // ['_rawData'] = objects of the row shown in arrays
  // [0] = value of the array 
  // output
  // _rowNumber: 2,
  // _rawData: [ '22/496698/PA/21355', 'Vian Sebastian', 'Student' ],
  // _deleted: false

  for (let i = 0; i < rows.length; i++) {
    if (rows[i]['_rawData'][0] == id) {
      return true;
    }
  }
  return false;
}


// to uniformly input actions
export function actionCheck(action){
  let lowerCaseAction = action.toLowerCase();

  if (lowerCaseAction === 'in') lowerCaseAction = 'In';
  else if (lowerCaseAction === 'out') lowerCaseAction = 'Out';
  else throw new Error('Invalid action input. Please input in or out.');

  return lowerCaseAction;
}

visitorCheck('2wfowenfaio', 'arya', 'Student');

