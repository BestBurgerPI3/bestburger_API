import { HOSTDB, USERDB, PASSDB, DATABASE, PORTDB } from '../config'
import mariadb from 'mariadb'

export const pool = mariadb.createPool({
    host: `${HOSTDB}`,
    user: `${USERDB}`,
    password: `${PASSDB}`,
    database: DATABASE,
    port: `${PORTDB}`
})