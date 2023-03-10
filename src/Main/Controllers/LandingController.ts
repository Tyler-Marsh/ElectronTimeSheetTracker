import { app } from "electron";
import path from "path";
import fs from "fs";
import bs3 from "better-sqlite3";
import { SettingsJsonModel } from "../../Render/Models/InitModel";
//const sqlite3 = require('sqlite3').verbose();

export async function GetDBs(): Promise<string[] | NodeJS.ErrnoException> {
  return new Promise((resolve, reject) => {
    const dbs: string[] = [];
    fs.readdir(path.join(app.getPath("userData"), "db"), function (err, files) {
      path.join(app.getPath("userData"), "db");

      if (err) {
        console.log("ERR AT GetDBs(): " + err);
        reject(err);
      }

      files.forEach((file) => {
        dbs.push(file);
      });
      resolve(dbs);
    });
  });
}

export function CreateSettingsJSON(dbName: string): boolean {
  const jsonName = dbName + ".json";
  const jsonContent = {
    rounding: "none",
    payPeriodStartDate: 0,
  };

  const data = JSON.stringify(jsonContent);

  const jsonPath = path.join(app.getPath("userData"), "db", jsonName);

  try {
    fs.writeFileSync(jsonPath, data);
  } catch (err) {
    console.log("ERROR @ CreateSettingsJSON " + err);
    return false;
  }
  return true;
}

export function ChangeSettingsJSON(
  fullFilePath: string,
  oldJson: SettingsJsonModel
): boolean {
  const jsonFile: string = fs.readFileSync(fullFilePath, "utf-8");
  const json: SettingsJsonModel = JSON.parse(jsonFile);

  json.payPeriodStartDate = oldJson.payPeriodStartDate;
  json.rounding = oldJson.rounding;
  const content = JSON.stringify(json);

  try {
    fs.writeFileSync(fullFilePath, content);
    return true;
  } catch (err) {
    console.log("ERROR # LandingController ChangeSettingsJSON: " + err);
    return false;
  }
}

export function EditSettingsJSON(
  dbName: string,
  operation: string,
  newName: string | undefined | null
): boolean {
  const jsonName = dbName.split(".")[0] + ".json";
  const aPath = path.join(app.getPath("userData"), "db", jsonName);
  try {
    if (operation === "delete") {
      fs.unlinkSync(aPath);
      return true;
    }
    const newJsonName = newName + ".json";
    const newPath = path.join(app.getPath("userData"), "db", newJsonName);
    fs.renameSync(aPath, newPath);
    return true;
  } catch (err) {
    console.log("ERROR @ EditSettingsJSON: " + err);
    return false;
  }
}

export async function CreateDB(dbName: string): Promise<boolean> {
  //	By default, it uses the OPEN_READWRITE | OPEN_CREATE mode. It means that if the database does not exist, the new database will be created and is ready for read and write.

  // default is OPEN_READWRITE | OPEN_CREATE
  dbName += ".db";
  const aPath = path.join(app.getPath("userData"), "db", dbName);

  const db: bs3.Database = new bs3(aPath);

  //      let db = new sqlite3.Database(aPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
  //       //@ts-ignore
  // , (err) => {
  //     if (err) {
  //         console.error(err.message);
  //     } else {
  //         console.log('Connected to the chinook database.');
  //     }
  // });

  // @ts-ignore
  //  const newDB =  await new sqlite3.Database(aPath, (err) => {
  //   if (err) {
  //     console.log("sqlite3 err: " +err);
  //   }
  //   }

  //  })
  //  newDB.close();

  //  return true;

  try {
    db.exec(
      `CREATE TABLE IF NOT EXISTS Department (
            pk_DepartmentId integer NOT NULL CONSTRAINT Department_pk PRIMARY KEY,
            Name varchar(50) NOT NULL
          );          
          CREATE TABLE IF NOT EXISTS Employee (
            pk_EmployeeId integer NOT NULL CONSTRAINT Employee_pk PRIMARY KEY,
            Name varchar(30) NOT NULL,
            fk_DepartmentId integer,
            DeleteIndicator integer,
            CONSTRAINT Employee_Department FOREIGN KEY (fk_DepartmentId)
            REFERENCES Department (pk_DepartmentId)
          );
          CREATE TABLE IF NOT EXISTS Shift (
            pk_ShiftId integer  NOT NULL CONSTRAINT Shift_pk PRIMARY KEY,
            Start datetime NOT NULL,
            "End" datetime NOT NULL,
            fk_EmployeeId integer NOT NULL,
            Comments varchar(200),
            Extra decimal(4,2),
            BreakTime integer,
            CONSTRAINT Shift_Employee FOREIGN KEY (fk_EmployeeId)
            REFERENCES Employee (pk_EmployeeId)
          );  `
    );
  } catch (err) {
    db.close();
    console.log(err);
    return false;
  }
  db.close();
  return true;
}

export async function DeleteDB(dbName: string): Promise<boolean> {
  dbName += ".db";
  const aPath = path.join(app.getPath("userData"), "db", dbName);
  return new Promise((resolve, reject) => {
    try {
      fs.unlink(aPath, (err) => {
        if (err) console.log(err);
      });
      resolve(true);
    } catch (err) {
      console.log(err);
      reject(false);
    }
  });
}

export async function RenameDB(paths: string[]): Promise<boolean> {
  const oldPath = path.join(app.getPath("userData"), "db", paths[0]);
  let newPath = path.join(app.getPath("userData"), "db", paths[1]);
  newPath += ".db";

  return new Promise((resolve, reject) => {
    try {
      fs.rename(oldPath, newPath, (err) => {
        if (err) console.log(err + " @@RenameDB at fs.rename");
      });
      resolve(true);
    } catch (err) {
      console.log(err + " @@RenameDB at catch");
    }
    reject(false);
  });
}
