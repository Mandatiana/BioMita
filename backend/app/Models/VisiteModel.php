<?php

namespace App\Models;

use CodeIgniter\Model;

class VisiteModel extends Model
{
    protected $table            = 'visites';
    protected $primaryKey       = 'id';
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $useTimestamps    = false;

    protected $allowedFields    = [
        'representant_nom',
        'cin_passeport',
        'nationalite',
        'nombre_visiteurs',
        'aire_id',
        'agent_id',
        'montant_total',
        'date_visite',
    ];

    protected $validationRules  = [
        'representant_nom' => 'required|max_length[150]',
        'cin_passeport'    => 'required|max_length[50]',
        'nationalite'      => 'required|max_length[100]',
        'nombre_visiteurs' => 'required|integer|greater_than[0]',
        'aire_id'          => 'required|integer',
        'agent_id'         => 'required|integer',
        'montant_total'    => 'required|decimal',
        'date_visite'      => 'required|valid_date',
    ];

    // --- Méthodes métier ---
    public function getVisitesParAire(int $aireId)
    {
        return $this->where('aire_id', $aireId)
                    ->orderBy('date_visite', 'DESC')
                    ->findAll();
    }

    public function getVisitesAvecDetails()
    {
        return $this->select('visites.*, aires_protegees.nom as aire_nom, utilisateurs.nom as agent_nom')
                    ->join('aires_protegees', 'aires_protegees.id = visites.aire_id')
                    ->join('utilisateurs', 'utilisateurs.id = visites.agent_id')
                    ->findAll();
    }
}