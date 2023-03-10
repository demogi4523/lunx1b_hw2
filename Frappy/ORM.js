import fs from 'fs';

import pg from 'pg';

const { Client } = pg;

export default class ORM {
  constructor(pg_options) {
    const { pg_host, pg_port, pg_database, pg_user, pg_password } = pg_options;
    this._client = new Client({
      host: pg_host,
      port: pg_port,
      database: pg_database,
      user: pg_user,
      password: pg_password,
    });
  }

  async create(sql_path, name) {
    try {
      const raw_sql_template = fs.readFileSync(sql_path, {
        encoding:'utf-8'
      });
      const raw_sql = raw_sql_template.replace("<genre_name>", name);
      return await this._client.query(raw_sql);
    } catch (err) {
      throw new Error(`ORM error: \n ${err}`);
    }
  }

  async read(sql_path, pk) {
    try {
      const raw_sql_template = fs.readFileSync(sql_path, {
        encoding:'utf-8'
      });
      const raw_sql = raw_sql_template.replace("<genre_pk>", pk);
      return await this._client.query(raw_sql);
    } catch (err) {
      throw new Error(`ORM error: \n ${err}`);
    }
  }

  async read_all(sql_path) {
    try {
      const raw_sql_template = fs.readFileSync(sql_path, {
        encoding:'utf-8'
      });
      return await this._client.query(raw_sql_template);
    } catch (err) {
      throw new Error(`ORM error: \n ${err}`);
    }
  }

  async update(sql_path, pk, new_params) {
    try {
      const raw_sql_template = fs.readFileSync(sql_path, {
        encoding:'utf-8'
      });
      let raw_sql = raw_sql_template.replace("<genre_pk>", pk);
      console.log(new_params);
      for (const [placeholder, value] of Object.entries(new_params)) {
        raw_sql = raw_sql.replace(`<${placeholder}>`, value);
      }
      console.log(raw_sql);
      return await this._client.query(raw_sql);
    } catch (err) {
      throw new Error(`ORM error: \n ${err}`);
    }
  }

  async delete(sql_path, pk) {
    try {
      const raw_sql_template = fs.readFileSync(sql_path, {
        encoding:'utf-8'
      });
      const raw_sql = raw_sql_template.replace("<genre_pk>", pk);
      return await this._client.query(raw_sql);
    } catch (err) {
      throw new Error(`ORM error: \n ${err}`);
    }
  }

  async connect() {
    await this._client.connect()
  }

  async disconnect() {
    await this._client.end();
  }

  async init_database(schema_sql_path) {
    try {
      const raw_sql = fs.readFileSync(schema_sql_path, {
        encoding:'utf-8'
      });
      return await this.query(raw_sql);
    } catch (err) {
      throw new Error(`ORM error: \n ${err}`);
    }
  }

  async query(query) {
    const res = await this._client.query(query);
    return res;
  }
}

export function createModel(tablename, schema_object) {
  return new Model(tablename, schema_object);
}


class PrimaryKey {

}

class ForeignKey {

}

export class Model {
  constructor(tablename, schema_object) {
    this.tablename = tablename;
    this._fields = this._get_fields(schema_object);
  }

  _get_database_type(field_type) {
    switch (field_type) {
      case String:
        return 'varchar';
      case Date:
        return 'date';
      case PrimaryKey:
        return PrimaryKey.toString();
      case ForeignKey:
        return ForeignKey.toString();
    }
  }

  _get_fields(schema_object) {
    const fields = [];
    for (const [field_name, field_type] of Object.entries(schema_object)) {
      fields.push(`${field_name} ${field_type}`);
    }
    return fields;
  }

}
