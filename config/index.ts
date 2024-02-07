import dotenv from 'dotenv';
import Joi from 'joi';
import path from 'path';

dotenv.config({
    path: path.join(
      __dirname,
      `../../.env.${process.env.NODE_ENV || 'production'}.local`
    ),
  });
export class Config{
    private static instance: Config;
    public envVarsSchema: Joi.ObjectSchema<any> | undefined;

    public upload: {
        allowedFileTypes: string[];
        filesTypes: {
          audio: {
            allowed: string[];
            disallowed: string[];
          };
          image?: {
            allowed: string[];
            disallowed: string[];
          };
          video?: {
            allowed: string[];
            disallowed: string[];
          };
          document: {
            allowed: string[];
            disallowed: string[];
          };
        };
      };

      private constructor(){
        this.envVarsSchema = Joi.object()
      .keys({
        // PROJECT
        PROJECT_NAME: Joi.string()
          .required()
          .description('Project code name (no spacial chars, no spaces)'),
        PROJECT_DISPLAY_NAME: Joi.string()
          .required()

          .description('Project display name'),
        PROJECT_DESCRIPTION: Joi.string()

          .required()
          .description('Project description'),
        FRONTEND_URL: Joi.string()

          .required()
          .description('Frontend app url, used for password reset'),

        // Data Validation Constraints
        MIN_PASSWORD_LENGTH: Joi.number()
          .default(8)
          .description('Minimum password length'),
        MAX_PASSWORD_LENGTH: Joi.number()
          .default(255)
          .description('Maximum password length'),
        MIN_USERNAME_LENGTH: Joi.number()
          .default(1)
          .description('Minimum username length'),
        MAX_USERNAME_LENGTH: Joi.number()
          .default(50)
          .description('Maximum username length'),
        MAX_USER_FULLNAME_LENGTH: Joi.number()
          .default(70)
          .description('Maximum user fullname length'),
        MIN_EMAIL_LENGTH: Joi.number()
          .default(3)
          .description('Minimum email length'),
        MAX_EMAIL_LENGTH: Joi.number()
          .default(255)
          .description('Maximum email length'),

        // NODE
        NODE_ENV: Joi.string()
          .valid('production', 'development', 'test')
          .required(),
        SECRET_KEY: Joi.string()

          .required()
          .description('General purpose secret key. Not widely used.'),
        LOG_FORMAT: Joi.string()

          .required()
          .description('Log format'),
        LOG_DIR: Joi.string()

          .required()
          .description('Log directory'),
        PORT: Joi.number()
          .default(3000)
          .description('Port number to run the server on'),

        // HTTP
        KEEP_ALIVE_TIMEOUT: Joi.number()
          .required()
          .description('Http keep alive timeout'),
        PARAMETER_LIMIT: Joi.number()
          .required()
          .description('Http parameter limit'),
        MAXIMUM_REQUEST_BODY_SIZE: Joi.string()
          .required()

          .description('Http request body size'),
        DOMAIN_NAME: Joi.string()
          .required()

          .description('Application full domaine name'),

        // DB
        DB_URL: Joi.string()

          .required()
          .description('DB URL is required'),

        // CORS
        ORIGIN: Joi.string().required().description('CORS origin'),
        CREDENTIALS: Joi.boolean()
          .default(false)
          .description('CORS credentials'),

        // JWT
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
          .default(30)
          .description('Minutes after which access tokens expire'),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
          .default(30)
          .description('Days after which refresh tokens expire'),
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
          .default(10)
          .description('Minutes after which reset password token expires'),
        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
          .default(10)
          .description('Minutes after which verify email token expires'),

        // EMAIL
        SMTP_HOST: Joi.string().description('Server that will send the emails'),
        SMTP_PORT: Joi.number().description(
          'Port to connect to the email server'
        ),
        SMTP_USERNAME: Joi.string().description('Username for email server'),
        SMTP_PASSWORD: Joi.string().description('Password for email server'),
        EMAIL_FROM: Joi.string()
          .required()
          .description('The from field in the emails sent by the app'),
        // twilio
        TWILIO_ACCOUNT_SID: Joi.string().description('Twilio account SID'),
        TWILIO_AUTH_TOKEN: Joi.string().description('Twilio auth token'),
        TWILIO_PHONE_NUMBER: Joi.string().description('Twilio phone number'),

        // UPLOAD
        UPLOAD_ALLOWED_FILE_TYPES: Joi.string().description(
          'Upload allowed file types'
        ),
        UPLOAD_AUDIO_ALLOWED_FILE_TYPES: Joi.string().description(
          'Upload allowed audio file types'
        ),
        UPLOAD_AUDIO_DISALLOWED_FILE_TYPES: Joi.string()
          .description('Upload disallowed audio file types')
          .optional(),
        UPLOAD_IMAGE_ALLOWED_FILE_TYPES: Joi.string().description(
          'Upload allowed image file types'
        ),
        UPLOAD_IMAGE_DISALLOWED_FILE_TYPES: Joi.string().description(
          'Upload disallowed image file types'
        ),
        UPLOAD_VIDEO_ALLOWED_FILE_TYPES: Joi.string().description(
          'Upload allowed video file types'
        ),
        UPLOAD_VIDEO_DISALLOWED_FILE_TYPES: Joi.string().description(
          'Upload disallowed video file types'
        ),
        UPLOAD_DOCUMENT_ALLOWED_FILE_TYPES: Joi.string().description(
          'Upload allowed document file types'
        ),
        UPLOAD_DOCUMENT_DISALLOWED_FILE_TYPES: Joi.string().description(
          'Upload disallowed document file types'
        ),
      })
      .unknown();
         // Validate env vars
    const { value: envVars, error } = this.envVarsSchema
    .prefs({ errors: { label: 'key' }, abortEarly: true })
    .validate(process.env);

        this.upload = {
            allowedFileTypes: envVars.UPLOAD_ALLOWED_FILE_TYPES?.split(','),
            filesTypes: {
              audio: {
                allowed: envVars.UPLOAD_AUDIO_ALLOWED_FILE_TYPES?.split(','),
                disallowed: envVars.UPLOAD_AUDIO_DISALLOWED_FILE_TYPES?.split(','),
              },
              image: {
                allowed: envVars.UPLOAD_IMAGE_ALLOWED_FILE_TYPES?.split(','),
                disallowed: envVars.UPLOAD_IMAGE_DISALLOWED_FILE_TYPES?.split(','),
              },
              video: {
                allowed: envVars.UPLOAD_VIDEO_ALLOWED_FILE_TYPES?.split(','),
                disallowed: envVars.UPLOAD_VIDEO_DISALLOWED_FILE_TYPES?.split(','),
              },
              document: {
                allowed: envVars.UPLOAD_DOCUMENT_ALLOWED_FILE_TYPES?.split(','),
                disallowed: envVars.UPLOAD_DOCUMENT_DISALLOWED_FILE_TYPES?.split(','),
              },
            },
          };
      }

      public static getInstance(): Config {
        if (!Config.instance) {
          Config.instance = new Config();
        }
        return Config.instance;
      }

}

export default Config.getInstance();
