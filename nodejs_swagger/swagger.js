const swaggerUi = require('swagger-ui-express');
const swaggereJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        info: {
            title: 'Test API',
            version: '1.0.0',
            description: 'Test API with express',
        },
        host: 'localhost:300',
        basePath: '/'
    },
    components: {
        res: {
          BadRequest: {
            description: '잘못된 요청.',
          },
          Forbidden: {
            description: '권한이 없음.',
          },
          NotFound: {
            description: '없는 리소스 요청.',
          }
        },
        errorResult: {
          Error: {
            type: 'object',
            properties: {
              errMsg: {
                type: 'string',
                description: 'Error.'
              }
            }
          }
        }
      },
      schemes: ['http', 'https'], // 사용 가능한 통신 방식
      definitions:  // 모델 정의 (User 모델에서 사용되는 속성 정의)
      {
        'User': {
          type: 'object',
          properties: {
            id: {
              type: 'string'
            },
            age: {
              type: 'integer'
            },
            addr: {
              type: 'string'
            }
          }
        }
      },
    apis: ['./public', './swagger']
};

const specs = swaggereJsdoc(options);

module.exports = {
    swaggerUi,
    specs
};