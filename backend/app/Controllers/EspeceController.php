<?php

namespace App\Controllers;

use App\Models\EspeceModel;

class EspeceController extends BaseController
{
    protected EspeceModel $especeModel;

    public function __construct()
    {
        $this->especeModel = new EspeceModel();
    }

    // GET /especes
    public function index()
    {
        $especes = $this->especeModel->findAll();

        return $this->response->setJSON($especes);
    }

    // GET /especes/(:num)
    public function show($id = null)
    {
        $espece = $this->especeModel->find($id);

        if (! $espece) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Espèce introuvable.',
            ]);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'data'   => $espece,
        ]);
    }

    // POST /especes
    public function create()
    {
        $data = $this->request->getJSON(true);

        if (! $this->especeModel->save($data)) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'errors' => $this->especeModel->errors(),
            ]);
        }

        return $this->response->setStatusCode(201)->setJSON([
            'status'  => 'success',
            'message' => 'Espèce créée.',
            'id'      => $this->especeModel->getInsertID(),
        ]);
    }

    // PUT/PATCH /especes/(:num)
    public function update($id = null)
    {
        $espece = $this->especeModel->find($id);

        if (! $espece) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Espèce introuvable.',
            ]);
        }

        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();

        if (! $this->especeModel->update($id, $data)) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'errors' => $this->especeModel->errors(),
            ]);
        }

        return $this->response->setJSON([
            'status'  => 'success',
            'message' => 'Espèce mise à jour.',
        ]);
    }

    // DELETE /especes/(:num)
    public function delete($id = null)
    {
        $espece = $this->especeModel->find($id);

        if (! $espece) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Espèce introuvable.',
            ]);
        }

        $this->especeModel->delete($id);

        return $this->response->setJSON([
            'status'  => 'success',
            'message' => 'Espèce supprimée.',
        ]);
    }

    // GET /especes/menacees
    public function menacees()
    {
        $seuil   = $this->request->getGet('seuil') ?? 100;
        $especes = $this->especeModel->especesMenacees((int) $seuil);

        return $this->response->setJSON([
            'status' => 'success',
            'data'   => $especes,
        ]);
    }
}
