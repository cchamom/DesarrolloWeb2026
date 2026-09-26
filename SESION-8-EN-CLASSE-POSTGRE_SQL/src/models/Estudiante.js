import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.js';

export const Estudiante = sequelize.define('estudiante', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: { msg: 'El nombre es obligatorio' } },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,                               
    validate: { isEmail: { msg: 'Email inválido' } },
  },
  carrera: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'estudiantes',
});