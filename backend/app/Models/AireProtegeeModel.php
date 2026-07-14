<?php

namespace App\Models;

use CodeIgniter\Model;

class AireProtegeeModel extends Model
{
    protected $table            = 'aires_protegees';
    protected $primaryKey       = 'id';
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $useTimestamps    = false;

    protected $allowedFields    = ['nom', 'localisation', 'tarif_ticket', 'tarif_guide'];

    protected $validationRules  = [
        'nom'          => 'required|min_length[2]|max_length[150]',
        'localisation' => 'required|max_length[255]',
        'tarif_ticket' => 'required|decimal',
        'tarif_guide'  => 'required|decimal',
    ];

    // --- Méthodes métier ---
    public function withVisites(int $aireId)
    {
        return $this->select('aires_protegees.*, COUNT(visites.id) as nb_visites')
                    ->join('visites', 'visites.aire_id = aires_protegees.id', 'left')
                    ->where('aires_protegees.id', $aireId)
                    ->groupBy('aires_protegees.id')
                    ->first();
    }

    public function requestTarifs(int $aireId)
    {
        return $this->select('aires_protegees.tarif_ticket, aires_protegees.tarif_guide')
                    ->where('aires_protegees.id', $aireId)
                    ->findAll();
    }
}