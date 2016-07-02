/* global siteSettings:true, Mongo, Schema:true, SimpleSchema, Roles siteSettingsTypes:true getSiteSettingsSchema:true */

// Adapted from: https://github.com/yogiben/meteor-admin-settings

siteSettingsTypes = {
  string: {
    value: {
      type: String
    }
  },
  textarea: {
    value: {
      type: String,
      autoform: {
        afFieldInput: {
          rows: 5
        }
      }
    }
  },
  number: {
    value: {
      type: Number
    }
  },
  boolean: {
    value: {
      type: Boolean,
      autoform: {
        afFieldInput: {
          type: 'boolean-select'
        }
      }
    }
  },
  date: {
    value: {
      type: Date,
      autoform: {
        afFieldInput: {
          type: 'date'
        }
      }
    }
  },
  color: {
    value: {
      type: String,
      autoform: {
        afFieldInput: {
          type: 'color'
        }
      }
    }
  },
  password: {
    value: {
      type: String,
      autoform: {
        afFieldInput: {
          type: 'password'
        }
      }
    }
  }
};
