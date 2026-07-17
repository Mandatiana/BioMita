<?php

namespace App\Controllers;

use App\Models\IncidentModel;

class IncidentController extends BaseController
{
    protected IncidentModel $incidentModel;

    public function __construct()
    {
        $this->incidentModel = new IncidentModel();
    }

    // GET /incidents
    public function index()
    {
        $incidents = $this->incidentModel->getIncidentsAvecDetails();

        return $this->response->setJSON($incidents);
    }

    // GET /incidents/(:num)
    public function show($id = null)
    {
        $incident = $this->incidentModel->find($id);

        if (! $incident) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Incident introuvable.',
            ]);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'data'   => $incident,
        ]);
    }

    // POST /incidents
    public function create()
    {
        $data = $this->request->getJSON(true);

        if (! $this->incidentModel->save($data)) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'errors' => $this->incidentModel->errors(),
            ]);
        }

        return $this->response->setStatusCode(201)->setJSON([
            'status'  => 'success',
            'message' => 'Incident signalé.',
            'id'      => $this->incidentModel->getInsertID(),
        ]);
    }

    // PUT/PATCH /incidents/(:num)
    public function update($id = null)
    {
        $incident = $this->incidentModel->find($id);

        if (! $incident) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Incident introuvable.',
            ]);
        }

        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();

        if (! $this->incidentModel->update($id, $data)) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'errors' => $this->incidentModel->errors(),
            ]);
        }

        return $this->response->setJSON([
            'status'  => 'success',
            'message' => 'Incident mis à jour.',
        ]);
    }

    // DELETE /incidents/(:num)
    public function delete($id = null)
    {
        $incident = $this->incidentModel->find($id);

        if (! $incident) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Incident introuvable.',
            ]);
        }

        $this->incidentModel->delete($id);

        return $this->response->setJSON([
            'status'  => 'success',
            'message' => 'Incident supprimé.',
        ]);
    }

    // GET /incidents/non-resolus
    public function nonResolus()
    {
        $incidents = $this->incidentModel->getIncidentsNonResolus();

        return $this->response->setJSON([
            'status' => 'success',
            'data'   => $incidents,
        ]);
    }

    // GET /incidents/statut/(:segment)
    public function parStatut($statut = null)
    {
        $incidents = $this->incidentModel->getIncidentsParStatut($statut);

        return $this->response->setJSON([
            'status' => 'success',
            'data'   => $incidents,
        ]);
    }
}
