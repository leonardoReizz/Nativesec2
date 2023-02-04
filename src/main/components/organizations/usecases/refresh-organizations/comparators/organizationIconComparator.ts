import { newDatabase } from '../../../../../main';
import { OrganizationIconModelDatabase } from '../../../model/Organization';

export async function iconsComparator(
  icons: OrganizationIconModelDatabase[]
): Promise<boolean> {
  const db = newDatabase.getDatabase();

  const queryIcons = await Promise.all(
    icons.map(async (icon) => {
      const dbQuery: OrganizationIconModelDatabase[] = await new Promise(
        (resolve, reject) => {
          db.all(`SELECT * FROM organizationsIcons`, (error, rows) => {
            if (error) {
              console.log('ERROR ICON COMPARATOR SELECT ORGANIZATIONS ICONS');
              reject(error);
            }
            resolve(rows);
          });
        }
      );
    })
  );

  // const filterIcons = queryIcons.filter((icon) => icon)

  // queryIcons.map((icon, index) => {
  //   const filterIcon =
  // })

  return true;

  // const qIconFilter = queryIcons.filter((qIcon) => qIcon !== undefined);

  // if (queryIcons.length === 0 && icons.length > 0) {
  //   await Promise.all(
  //     icons.map(async (item) => {
  //       await database.run(
  //         `INSERT INTO organizationsIcons (_id, icone ) VALUES ('${item._id.$oid}','${item.icone}')`
  //       );
  //     })
  //   );
  //   return true;
  // }

  // if (icons.length > qIconFilter.length) {
  //   const arrayInsert: IIcons[] = [];
  //   for (let i = 0; i < icons.length; i++) {
  //     let equal = false;
  //     for (let x = 0; x < qIconFilter.length; x++) {
  //       if (qIconFilter[x]?._id === icons[i]._id.$oid) {
  //         equal = true;
  //       }
  //     }
  //     if (equal === false) {
  //       arrayInsert.push(icons[i]);
  //     }
  //   }

  //   if (arrayInsert.length > 0) {
  //     await Promise.all(
  //       arrayInsert.map(async (item) => {
  //         await database.run(
  //           `INSERT INTO organizationsIcons (_id, icone ) VALUES ('${item._id.$oid}','${item.icone}')`
  //         );
  //       })
  //     );
  //   }
  //   return true;
  // }
  // if (queryIcons.length > 0) {
  //   const arrayUpdate: IIcons[] = [];
  //   for (let i = 0; i < icons.length; i++) {
  //     let equal = false;
  //     for (let x = 0; x < qIconFilter.length; x++) {
  //       if (qIconFilter[x]?._id === icons[i]._id.$oid) {
  //         if (String(icons[i].icone) === String(qIconFilter[x]?.icone)) {
  //           equal = true;
  //         }
  //       }
  //     }
  //     if (equal === false) {
  //       arrayUpdate.push(icons[i]);
  //     }
  //   }

  //   if (arrayUpdate.length > 0) {
  //     await Promise.all(
  //       arrayUpdate.map(async (item) => {
  //         await database.all(
  //           `UPDATE organizationsIcons SET icone = '${item.icone}' WHERE _id = '${item._id.$oid}'`
  //         );
  //       })
  //     );
  //   }
  //   if (arrayUpdate.length > 0) {
  //     return true;
  //   }
  //   return false;
  // }
  // return false;
}
