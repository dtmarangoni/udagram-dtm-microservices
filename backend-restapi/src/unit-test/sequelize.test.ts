import 'mocha';
import { expect } from 'chai';
import { Sequelize } from 'sequelize-typescript';

import { sequelize } from '../sequelize';
import { V0MODELS } from '../controllers/v0/model.index';

describe('Sequelize', () => {
    it('Sequelize can be instantiated', () => {
        expect(sequelize).instanceOf(Sequelize);
    });

    it('Sequelize can link to path of DB Models', async () => {
        const result = await sequelize.addModels(V0MODELS);
        expect(result).to.be.undefined;
    });

    it('Sequelize can sync models with DB', async () => {
        const result = await sequelize.sync();
        expect(result).to.not.be.null;
    });
});
