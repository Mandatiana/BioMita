<?php

namespace App\Models;

use CodeIgniter\Model;

class UtilisateurModel extends Model
{
    protected $table            = 'utilisateurs';
    protected $primaryKey       = 'id';
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $allowedFields    = ['nom', 'password', 'role', 'created_at'];
    protected $useTimestamps    = false;

    protected $validationRules  = [
        'nom'      => 'required|min_length[2]|max_length[100]',
        'password' => 'required|min_length[8]',
        'role'     => 'required|in_list[agentTerrain,responsable]',
    ];
    protected $validationMessages = [];
    protected $skipValidation     = false;

    protected $beforeInsert = ['hashPassword', 'setCreatedAt'];
    protected $beforeUpdate = ['hashPassword'];

    protected function hashPassword(array $data)
    {
        if (isset($data['data']['password'])) {
            $data['data']['password'] = password_hash($data['data']['password'], PASSWORD_DEFAULT);
        }
        return $data;
    }

    protected function setCreatedAt(array $data)
    {
        $data['data']['created_at'] = date('Y-m-d H:i:s');
        return $data;
    }

    // --- Méthodes métier ---
    public function findByNom(string $nom)
    {
        return $this->where('nom', $nom)->first();
    }

    public function getAgentsTerrain()
    {
        return $this->where('role', 'agent')->findAll();
    }

    public function getInfoAgents()
    {
        return $this->select('utilisateurs.id, utilisateurs.nom as nom, aires_protegees.nom as aire_nom')
        // 1. On compte les ID uniques de chaque table rattachée
        ->select('COUNT(DISTINCT visites.id) as total_visites')
        ->select('COUNT(DISTINCT incidents.id) as total_incidents')
        ->select('COUNT(DISTINCT observations.id) as total_observations')
        
        // 2. Utilisation de LEFT JOIN pour ne pas masquer les agents qui ont 0 partout
        ->join('visites', 'visites.aire_id = utilisateurs.id', 'left')
        ->join('aires_protegees', 'aires_protegees.id = visites.aire_id', 'left')
        ->join('incidents', 'incidents.agent_id = utilisateurs.id', 'left')
        ->join('observations', 'observations.agent_id = utilisateurs.id', 'left')
        
        ->where('utilisateurs.role', 'agent')
        
        // 4. Groupement obligatoire pour que les COUNT() fonctionnent par agent
        ->groupBy('utilisateurs.id') 
        
        ->findAll();
    }
}
