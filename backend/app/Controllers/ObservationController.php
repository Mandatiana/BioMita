<?php

namespace App\Controllers;

use App\Models\ObservationModel;

class ObservationController extends BaseController
{
    protected ObservationModel $observationModel;

    public function __construct()
    {
        $this->observationModel = new ObservationModel();
    }

    // GET /observations
    public function index()
    {
        $observations = $this->observationModel->getObservationsAvecDetails();

        return $this->response->setJSON($observations);
    }

    // GET /observations/(:num)
    public function show($id = null)
    {
        $observation = $this->observationModel->find($id);

        if (! $observation) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Observation introuvable.',
            ]);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'data'   => $observation,
        ]);
    }

    // POST /observations
    public function create()
    {
        $data = $this->request->getJSON(true);

        if (! $this->observationModel->save($data)) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'errors' => $this->observationModel->errors(),
            ]);
        }

        return $this->response->setStatusCode(201)->setJSON([
            'status'  => 'success',
            'message' => 'Observation enregistrée.',
            'id'      => $this->observationModel->getInsertID(),
        ]);
    }

    // PUT/PATCH /observations/(:num)
    public function update($id = null)
    {
        $observation = $this->observationModel->find($id);

        if (! $observation) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Observation introuvable.',
            ]);
        }

        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();

        if (! $this->observationModel->update($id, $data)) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'errors' => $this->observationModel->errors(),
            ]);
        }

        return $this->response->setJSON([
            'status'  => 'success',
            'message' => 'Observation mise à jour.',
        ]);
    }

    // DELETE /observations/(:num)
    public function delete($id = null)
    {
        $observation = $this->observationModel->find($id);

        if (! $observation) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Observation introuvable.',
            ]);
        }

        $this->observationModel->delete($id);

        return $this->response->setJSON([
            'status'  => 'success',
            'message' => 'Observation supprimée.',
        ]);
    }

    // GET /especes/(:num)/observations
    public function parEspece($especeId = null)
    {
        $observations = $this->observationModel->getObservationsParEspece($especeId);

        return $this->response->setJSON([
            'status' => 'success',
            'data'   => $observations,
        ]);
    }
}
