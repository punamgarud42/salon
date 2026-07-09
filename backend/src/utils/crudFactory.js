/**
 * createCrudController — generates {getAll, create, update, remove}
 * handlers for a simple content model: seed defaults on first request,
 * list, create, update, delete. Used by gallery/testimonials/offers/
 * academy-highlights controllers, which would otherwise be four
 * near-identical copies of the same CRUD boilerplate already seen in
 * services.controller.js and courses.controller.js.
 *
 * Kept separate from those two (rather than retrofitting them onto this
 * factory) since they have slightly different seeding/response needs
 * (services/courses back specific booking/enrollment flows); this factory
 * is for the simpler "list of editable content" models.
 */
import { withId, withIds } from './withId.js';

export function createCrudController(Model, defaultSeed = [], { sort = { createdAt: 1 } } = {}) {
  async function getAll(req, res) {
    try {
      let docs = await Model.find().sort(sort);
      if (docs.length === 0 && defaultSeed.length > 0) {
        docs = await Model.insertMany(defaultSeed);
      }
      res.json(withIds(docs));
    } catch (err) {
      console.error(`[${Model.modelName}] getAll failed:`, err);
      res.status(500).json({ error: `Could not load ${Model.modelName.toLowerCase()} list.` });
    }
  }

  async function create(req, res) {
    try {
      const doc = await Model.create(req.body);
      res.status(201).json(withId(doc));
    } catch (err) {
      console.error(`[${Model.modelName}] create failed:`, err);
      res.status(400).json({ error: `Could not create ${Model.modelName.toLowerCase()}.` });
    }
  }

  async function update(req, res) {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!doc) return res.status(404).json({ error: `${Model.modelName} not found.` });
      res.json(withId(doc));
    } catch (err) {
      console.error(`[${Model.modelName}] update failed:`, err);
      res.status(400).json({ error: `Could not update ${Model.modelName.toLowerCase()}.` });
    }
  }

  async function remove(req, res) {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ error: `${Model.modelName} not found.` });
      res.json({ message: `${Model.modelName} deleted.` });
    } catch (err) {
      console.error(`[${Model.modelName}] remove failed:`, err);
      res.status(500).json({ error: `Could not delete ${Model.modelName.toLowerCase()}.` });
    }
  }

  return { getAll, create, update, remove };
}
