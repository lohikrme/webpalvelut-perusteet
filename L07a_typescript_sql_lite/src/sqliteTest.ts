
import db from './initDatabase'
import { Hero, Hero_power } from './db_interface'



// INSERT TEST DATA
const insertRows: string =
    `
    INSERT OR IGNORE INTO hero (hero_id, hero_name, is_xman, was_snapped)
    VALUES
        (1, 'Keke', 'N', 'N'),
        (2, 'Kimmo', 'N', 'N'),
        (3, 'Repe', 'N', 'N'),
        (4, 'Anni', 'N', 'N'),
        (5, 'Kalle', 'N', 'Y'),
        (6, 'Olli', 'Y', 'N');

    INSERT INTO hero_power (hero_id, hero_power)
    VALUES
        (1, 'Formulakuski'),
        (2, 'Lusmu'),
        (3, 'Opiskelija'),
        (4, 'Skeittaaja'),
        (5, 'Juoksija'),
        (6, 'Super-Ninja-Koodari')
    `

db.exec(insertRows, (err: Error | null) => {
    if (err) {
        console.error(`Error inserting tables: ${err.message}`);
        console.error(`Stack trace: ${err.stack}`);
        throw err;
    }
    else {
        console.log(`rows created`);
    }
});

let sql_select: string = 'SELECT * FROM hero;';
console.log();

const col_width = 17;

db.all(sql_select, (err: Error | null, rows: Hero[]) => {
    if (err) throw err;
    rows.forEach(row => {
        console.log(
            `id: ${row.hero_id}`.padEnd(10) +
            `name: ${row.hero_name}`.padEnd(col_width) +
            `is_axman: ${row.is_xman}`.padEnd(col_width) +
            `was_snapped: ${row.was_snapped}`.padEnd(col_width)
        )
    });
});

/*
db.each(sql_select, (err: Error | null, rows: Hero) => {
    if (err) throw err;
    console.log(
        `id: ${row}
        name: ${row.hero_name}
        is_axman: ${row.is_xman}
        was_snapped: ${row.was_snapped}
    `
    )

});
*/
