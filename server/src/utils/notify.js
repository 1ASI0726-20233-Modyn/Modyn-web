const Notification = require("../models/Notification");
const NotificationPreference = require("../models/NotificationPreference");

/**
 * Crea una notificación para un usuario, respetando sus preferencias.
 * Si el usuario tiene NPR_enabled=false para ese NOT_type, no se crea nada.
 * Si el usuario no tiene preferencia guardada para ese tipo, se asume habilitado por defecto.
 *
 * @param {number} USU_id
 * @param {"order"|"promo"|"shipment"|"return"|"review"|"wishlist"|"system"} NOT_type
 * @param {string} NOT_message
 */
async function crearNotificacion(USU_id, NOT_type, NOT_message) {
    try {
        if (!USU_id || !NOT_type || !NOT_message) return null;

        // Revisar preferencia del usuario para este tipo (si existe)
        const pref = await NotificationPreference.findOne({ USU_id, NPR_type: NOT_type });
        if (pref && pref.NPR_enabled === false) {
            return null; // el usuario desactivó este tipo de notificación
        }

        const ultimo = await Notification.findOne({}, {}, { sort: { NOT_id: -1 } });
        const nuevoId = ultimo ? ultimo.NOT_id + 1 : 1;

        return await Notification.create({
            NOT_id: nuevoId,
            USU_id,
            NOT_type,
            NOT_message
        });
    } catch (err) {
        console.error("Error creando notificación:", err.message);
        return null;
    }
}

/**
 * Crea la misma notificación para varios usuarios (ej. anuncio de promoción).
 * @param {number[]} usuarioIds
 * @param {string} NOT_type
 * @param {string} NOT_message
 */
async function crearNotificacionMasiva(usuarioIds, NOT_type, NOT_message) {
    for (const USU_id of usuarioIds) {
        await crearNotificacion(USU_id, NOT_type, NOT_message);
    }
}

module.exports = { crearNotificacion, crearNotificacionMasiva };
