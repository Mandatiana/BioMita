<?php

namespace App\Controllers;

use App\Models\UtilisateurModel;

class UtilisateurController extends BaseController
{
    protected UtilisateurModel $utilisateurModel;

    public function __construct()
    {
        $this->utilisateurModel = new UtilisateurModel();
    }

    // GET /utilisateurs
    public function index()
    {
        $utilisateurs = $this->utilisateurModel->findAll();

        return $this->response->setJSON([
            'status' => 'success',
            'data'   => $utilisateurs,
        ]);
    }

    // GET /utilisateurs/(:num)
    public function show($id = null)
    {
        $utilisateur = $this->utilisateurModel->find($id);

        if (! $utilisateur) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Utilisateur introuvable.',
            ]);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'data'   => $utilisateur,
        ]);
    }

    // POST /utilisateurs
    public function create()
    {
        $data = $this->request->getJSON(true);

        if (! $this->utilisateurModel->save($data)) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'errors' => $this->utilisateurModel->errors(),
            ]);
        }

        return $this->response->setStatusCode(201)->setJSON([
            'status'  => 'success',
            'message' => 'Utilisateur créé.',
            'id'      => $this->utilisateurModel->getInsertID(),
        ]);
    }

    // PUT/PATCH /utilisateurs/(:num)
    public function update($id = null)
    {
        $utilisateur = $this->utilisateurModel->find($id);

        if (! $utilisateur) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Utilisateur introuvable.',
            ]);
        }

        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();

        if (! $this->utilisateurModel->update($id, $data)) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'errors' => $this->utilisateurModel->errors(),
            ]);
        }

        return $this->response->setJSON([
            'status'  => 'success',
            'message' => 'Utilisateur mis à jour.',
        ]);
    }

    // DELETE /utilisateurs/(:num)
    public function delete($id = null)
    {
        $utilisateur = $this->utilisateurModel->find($id);

        if (! $utilisateur) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Utilisateur introuvable.',
            ]);
        }

        $this->utilisateurModel->delete($id);

        return $this->response->setJSON([
            'status'  => 'success',
            'message' => 'Utilisateur supprimé.',
        ]);
    }

    // GET /utilisateurs/agents-terrain
    public function agentsTerrain()
    {
        $agents = $this->utilisateurModel->getAgentsTerrain();

        return $this->response->setJSON($agents);
    }

    public function infoAgents()
    {
        $agents = $this->utilisateurModel->getInfoAgents();
        return $this->response->setJSON($agents);
    }
}
