import { DataSource } from 'typeorm';

import User from './entity/User';
import UserConfirm from './entity/UserConfirm';
import AuthToken from './entity/AuthToken';
import Topic from './entity/Topic';

const config = useRuntimeConfig();

const dbs = new DataSource({
    type:           'sqlite',
    database:       config.dbPath,
    synchronize:    true, // config.mode === 'dev', ???
    entities:       [
        User,
        UserConfirm,
        AuthToken,
        Topic,
    ]
});

let db = dbs.initialize();

export default function getDb()
{
    return db;
}