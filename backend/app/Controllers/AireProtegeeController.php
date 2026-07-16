<?php

namespace App\Controllers;

use App\Models\AireProtegeeModel;

class AireProtegeeController extends BaseController
{
    protected AireProtegeeModel $aireModel;

    public function __construct()
    {
        $this->aireModel = new AireProtegeeModel();
    }

    // GET /aires-protegees
    public function index()
    {
        $aires = $this->aireModel->findAll();

        return $this->response->setJSON($aires);
    }

    // GET /aires-protegees/(:num)
    public function show($id = null)
    {
        $aire = $this->aireModel->find($id);

        if (! $aire) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Aire protégée introuvable.',
            ]);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'data'   => $aire,
        ]);
    }

    // POST /aires-protegees
    public function create()
    {
        $data = $this->request->getJSON(true);

        if (! $this->aireModel->save($data)) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'errors' => $this->aireModel->errors(),
            ]);
        }

        return $this->response->setStatusCode(201)->setJSON([
            'status'  => 'success',
            'message' => 'Aire protégée créée.',
            'id'      => $this->aireModel->getInsertID(),
        ]);
    }

    // PUT/PATCH /aires-protegees/(:num)
    public function update($id = null)
    {
        $aire = $this->aireModel->find($id);

        if (! $aire) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Aire protégée introuvable.',
            ]);
        }

        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();

        if (! $this->aireModel->update($id, $data)) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'errors' => $this->aireModel->errors(),
            ]);
        }

        return $this->response->setJSON([
            'status'  => 'success',
            'message' => 'Aire protégée mise à jour.',
        ]);
    }

    // DELETE /aires-protegees/(:num)
    public function delete($id = null)
    {
        $aire = $this->aireModel->find($id);

        if (! $aire) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Aire protégée introuvable.',
            ]);
        }

        $this->aireModel->delete($id);

        return $this->response->setJSON([
            'status'  => 'success',
            'message' => 'Aire protégée supprimée.',
        ]);
    }

    // GET /aires-protegees/(:num)/stats
    public function stats($id = null)
    {
        $aire = $this->aireModel->withVisites($id);

        if (! $aire) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Aire protégée introuvable.',
            ]);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'data'   => $aire,
        ]);
    }
    public function getTarifs($id = null)
    {
        $tarifs = $this->aireModel->requestTarifs($id);

        if (! $tarifs) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Tarifs aire protégée introuvable.',
            ]);
        }
        return $this->response->setJSON([
            'status' => 'success',
            'data'   => $tarifs,
        ]);
    }
}
