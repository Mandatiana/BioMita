<?php

namespace App\Models;

use CodeIgniter\Model;

class IncidentModel extends Model
{
    protected $table            = 'incidents';
    protected $primaryKey       = 'id';
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $useTimestamps    = false;

    protected $allowedFields    = [
        'type_incident',
        'localisation',
        'description',
        'statut',
        'aire_id',
        'agent_id',
        'date_incident',
    ];

    protected $validationRules  = [
        'type_incident' => 'required|max_length[100]',
        'localisation'  => 'required|max_length[255]',
        'description'   => 'required',
        'statut'        => 'permit_empty|in_list[signale,en_cours,resolu]',
        'aire_id'       => 'required|integer',
        'agent_id'      => 'required|integer',
        'date_incident' => 'required|valid_date',
    ];

    // --- Méthodes métier ---
    public function getIncidentsParStatut(string $statut)
    {
        return $this->where('statut', $statut)
                    ->orderBy('date_incident', 'DESC')
                    ->findAll();
    }

    public function getIncidentsNonResolus()
    {
        return $this->whereIn('statut', ['signale', 'en_cours'])
                    ->orderBy('date_incident', 'DESC')
                    ->findAll();
    }

    public function getIncidentsAvecDetails()
    {
        return $this->select('incidents.*, aires_protegees.nom as aire_nom, utilisateurs.nom as agent_nom')
                    ->join('aires_protegees', 'aires_protegees.id = incidents.aire_id')
                    ->join('utilisateurs', 'utilisateurs.id = incidents.agent_id')
                    ->orderBy('date_incident', 'DESC')
                    ->findAll();
    }
}