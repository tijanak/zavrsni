import torch

import json
def cosine_search(database_vectors, query_vector):
    
    if not isinstance(database_vectors, (list, torch.Tensor)):
        raise TypeError("database_vectors must be a list or a torch.Tensor")
    
    if not isinstance(query_vector, (list, torch.Tensor)):
        raise TypeError("query_vector must be a list or a torch.Tensor")
    database_vectors = torch.tensor(database_vectors, dtype=torch.float32)
    query_vector = torch.tensor(query_vector, dtype=torch.float32)
    if database_vectors.ndim != 2:
        raise ValueError("database_vectors must be a 2D tensor")
    if query_vector.ndim != 1:
        raise ValueError("query_vector must be a 1D tensor")
    
    if torch.cuda.is_available():
        database_vectors = database_vectors.cuda()
        query_vector = query_vector.cuda()
    database_norm = torch.norm(database_vectors, dim=1, keepdim=True)
    query_norm = torch.norm(query_vector)
    database_vectors_normalized = database_vectors / database_norm
    query_vector_normalized = query_vector / query_norm

    
    similarities = torch.sum(database_vectors_normalized * query_vector_normalized, dim=1)

    return similarities.cpu().numpy()

def find_similarities(database_vectors, query_vector,id_max_similarity):
    response=[]
    if(len(database_vectors)!=0):


        vectors = [entry['vector'] for entry in database_vectors]
        similarities = cosine_search(vectors, query_vector)
        
        for index, entry in enumerate(database_vectors):
            vector_id = entry['id']
            similarity = float(similarities[index])
            if (not(vector_id in id_max_similarity) or (similarity > id_max_similarity[vector_id] ))and similarity>0.55:
                id_max_similarity[vector_id] = similarity
        
        

    return id_max_similarity
