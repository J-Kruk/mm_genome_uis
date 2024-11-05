import os
import numpy as np
import pandas as pd


##############
pilot_size = 5
num_batches = 5 
dest_dir = "prompts/batches"
##############

full_df = pd.read_csv("prompts/visual_taxonomy_answers_full_v1.csv", delimiter="|")
full_df = full_df.sample(frac=1)

pilot = full_df.iloc[:pilot_size]
p_filename = os.path.join(dest_dir, f"pilot.csv")
pilot.to_csv(p_filename, index=False)

batch_size = int((len(full_df) - pilot_size) / num_batches)
start_idx = pilot_size
end_idx = pilot_size + batch_size

for ind in range(num_batches):
    if ind < 4:
        b = full_df.iloc[start_idx:end_idx]
        b_filename = os.path.join(dest_dir, f"batch_{ind+1}.csv")
        b.to_csv(b_filename, sep='|', index=False)

        start_idx = end_idx
        end_idx += batch_size
        
    else:
        b = full_df.iloc[start_idx:]
        b_filename = os.path.join(dest_dir, f"batch_{ind+1}.csv")
        b.to_csv(b_filename, sep='|', index=False)
