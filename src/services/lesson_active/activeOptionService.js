const { ActiveOption } = require('../../models');

class ActiveOptionService {
    async existsById(id) {
        return !!await ActiveOption.count({ where: { id } });
    }

    async existsByIdAndGapId(id, activeGapId) {
        return !!await ActiveOption.count({ where: { id, activeGapId } });
    }

    async create(activeGapId, value) {
        return !!await ActiveOption.create({ activeGapId, value });
    }
}

module.exports = new ActiveOptionService();