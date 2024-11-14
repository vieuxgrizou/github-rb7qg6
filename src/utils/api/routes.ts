import { Router } from 'express';
import { auth } from '../middleware/auth';
import { 
  login, 
  register, 
  verifyToken,
  refreshToken 
} from '../controllers/auth';
import {
  getSites,
  createSite,
  updateSite,
  deleteSite
} from '../controllers/sites';
import {
  getPersonas,
  createPersona,
  updatePersona,
  deletePersona
} from '../controllers/personas';

const router = Router();

// Auth routes
router.post('/auth/login', login);
router.post('/auth/register', register);
router.post('/auth/verify', verifyToken);
router.post('/auth/refresh', refreshToken);

// Protected routes
router.use(auth);

// Sites
router.get('/sites', getSites);
router.post('/sites', createSite);
router.put('/sites/:id', updateSite);
router.delete('/sites/:id', deleteSite);

// Personas
router.get('/personas', getPersonas);
router.post('/personas', createPersona);
router.put('/personas/:id', updatePersona);
router.delete('/personas/:id', deletePersona);

export default router;