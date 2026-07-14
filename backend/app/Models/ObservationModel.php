<?php

namespace App\Models;

use CodeIgniter\Model;

class ObservationModel extends Model
{
    protected $table            = 'observations';
    protected $primaryKey       = 'id';
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $useTimestamps    = false;

    protected $allowedFields    = [
        'nombre_observe',
        'localisation',
        'commentaire',
        'espece_id',
        'aire_id',
        'agent_id',
        'date_observation',
    ];

    protected $validationRules  = [
        'nombre_observe'   => 'required|integer|greater_than_equal_to[0]',
        'localisation'     => 'required|max_length[255]',
        'espece_id'        => 'required|integer',
        'aire_id'          => 'required|integer',
        'agent_id'         => 'required|integer',
        'date_observation' => 'required|valid_date',
    ];

    // --- Méthodes métier ---
    public function getObservationsParEspece(int $especeId)
    {
        return $this->where('espece_id', $especeId)
                    ->orderBy('date_observation', 'DESC')
                    ->findAll();
    }

    public function getObservationsAvecDetails()
    {
        return $this->select('observations.*, especes.nom as espece_nom, aires_protegees.nom as aire_nom')
                    ->join('especes', 'especes.id = observations.espece_id')
                    ->join('aires_protegees', 'aires_protegees.id = observations.aire_id')
                    ->findAll();
    }
}