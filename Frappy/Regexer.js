export default class Regexer {
  constructor() {
    this._state = {};
  }

  add(path, method, callback) {
    const vars = [];
    const isValidRegex = this.isValidRegex(path);
    if (!isValidRegex) {
      throw new Error(`Path ${path} is invalid!!!`);
    }
    const parameter_regex_pattern = /<(\w)+:(\w)+>/
    let cur = this._state;
    const pathChunks = path.split('/').filter((chunk) => chunk.length > 0);
    for (let index = 0; index < pathChunks.length; index++) {
      const chunk = pathChunks[index];
      // if regex
      if (parameter_regex_pattern.test(chunk)) {
        const [url_variable_name, url_variable_type] = chunk.replace('<', '').replace('>', '').trim().split(':');
        vars.push(url_variable_name);

        switch (url_variable_type) {
          case 'text':
            if (cur.hasOwnProperty('__text')) {
              cur = cur['__text']
            } else {
              cur['__text'] = {};
              cur = cur['__text'];
            }
            break;
          case 'int':
            if (cur.hasOwnProperty('__int')) {
              cur = cur['__int']
            } else {
              cur['__int'] = {};
              cur = cur['__int'];
            }
            break;
          default:
            throw new Error(`Wrong url variable type: ${url_variable_type}!!!`)
        }
      } else {
        if (cur.hasOwnProperty(chunk)) {
          cur = cur[chunk];
        } else {
          cur[chunk] = {};
          cur = cur[chunk];
        }
      }

      if (index == pathChunks.length - 1) {
        if (cur.hasOwnProperty(method)) {
          throw new Error(`Regexer with path = ${path} and method = ${method} alrady exist!!!`);
        }
        cur[method] = { callback, parameters: vars };
      }
    }
  }

  has(path, method) {
    const pathChunks = path.split('/').filter((chunk) => chunk.length > 0);
    let cur = this._state;
    
    for (let index = 0; index < pathChunks.length; index += 1) {
      const chunk = pathChunks[index];
      
      if (cur.hasOwnProperty(chunk)) {
        cur = cur[chunk];
      } else {
        const intRegex = /^\d+$/;
        if (intRegex.test(chunk)) {
          if (cur.hasOwnProperty('__int')) {
            cur = cur['__int'];
            continue;
          } else {
            return false;
          }
        }

        const textRegex = /^.+$/;
        if (textRegex.test(chunk)) {
          if (cur.hasOwnProperty('__text')) {
            cur = cur['__text'];
            continue;
          } else {
            return false;
          }
        }
        // if all regexes wrong
        return false;
      }
    }

    if (!cur.hasOwnProperty(method)) {
      return false;
    }
    
    cur = cur[method];
    const { callback = null } = cur;
    if (callback === null) {
      return false;
    }

    return true;
  }

  get(path, method) {
    const pathChunks = path.split('/').filter((chunk) => chunk.length > 0);
    let cur = this._state;
    const var_values = [];
  
    for (let index = 0; index < pathChunks.length; index += 1) {
      const chunk = pathChunks[index];
      if (cur.hasOwnProperty(chunk)) {
        cur = cur[chunk];
      } else {
        const intRegex = /^\d+$/;
        if (intRegex.test(chunk)) {
          if (cur.hasOwnProperty('__int')) {
            var_values.push(parseInt(chunk));
            cur = cur['__int'];
            continue;
          } else {
            return false;
          }
        }

        const textRegex = /^.+$/;
        if (textRegex.test(chunk)) {
          if (cur.hasOwnProperty('__text')) {
            var_values.push(chunk);
            cur = cur['__text'];
            continue;
          } else {
            return false;
          }
        }
        // if all regexes wrong
        return false;
      }
    }

    if (!cur.hasOwnProperty(method)) {
      return false;
    }

    cur = cur[method];
    const { parameters, callback = null } = cur;
    if (callback === null) {
      return false;
    }
    const args = {};

    if (parameters.length !== var_values.length) {
      throw new Error(`WTF is going on!!!\nCritical error in Regexer realization!!!`);
    }

    for (let index = 0; index < parameters.length; index++) {
      const parameter = parameters[index];
      const arg = var_values[index];
      args[parameter] = arg;
    }
    return { parameters: args, callback };
  }

  isValidRegex(path) {
    const parameter_regex_pattern = /<(\w)+:(\w)+>/g;
    const pre_chunks = [...path.matchAll(parameter_regex_pattern)];
    
    return pre_chunks.length > 0;
  }
}
