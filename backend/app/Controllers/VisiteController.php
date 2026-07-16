<?php

namespace App\Controllers;

use App\Models\VisiteModel;

class VisiteController extends BaseController
{
    protected VisiteModel $visiteModel;

    public function __construct()
    {
        $this->visiteModel = new VisiteModel();
    }

    // GET /visites
    public function index()
    {
        $visites = $this->visiteModel->getVisitesAvecDetails();

        return $this->response->setJSON($visites);
    }

    // GET /visites/(:num)
    public function show($id = null)
    {
        $visite = $this->visiteModel->find($id);

        if (! $visite) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Visite introuvable.',
            ]);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'data'   => $visite,
        ]);
    }

    // POST /visites
    public function create()
    {
        $data = $this->request->getJSON(true);

        if (! $this->visiteModel->save($data)) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'errors' => $this->visiteModel->errors(),
            ]);
        }

        return $this->response->setStatusCode(201)->setJSON([
            'status'  => 'success',
            'message' => 'Visite enregistrée.',
            'id'      => $this->visiteModel->getInsertID(),
        ]);
    }

    // PUT/PATCH /visites/(:num)
    public function update($id = null)
    {
        $visite = $this->visiteModel->find($id);

        if (! $visite) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Visite introuvable.',
            ]);
        }

        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();

        if (! $this->visiteModel->update($id, $data)) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'errors' => $this->visiteModel->errors(),
            ]);
        }

        return $this->response->setJSON([
            'status'  => 'success',
            'message' => 'Visite mise à jour.',
        ]);
    }

    // DELETE /visites/(:num)
    public function delete($id = null)
    {
        $visite = $this->visiteModel->find($id);

        if (! $visite) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Visite introuvable.',
            ]);
        }

        $this->visiteModel->delete($id);

        return $this->response->setJSON([
            'status'  => 'success',
            'message' => 'Visite supprimée.',
        ]);
    }

    // GET /aires-protegees/(:num)/visites
    public function parAire($aireId = null)
    {
        $visites = $this->visiteModel->getVisitesParAire($aireId);

        return $this->response->setJSON([
            'status' => 'success',
            'data'   => $visites,
        ]);
    }
}
