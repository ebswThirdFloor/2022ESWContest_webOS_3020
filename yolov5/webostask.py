from glob import glob 
import os 
import argparse

def inference(root):
  train_label_list = glob(root)
  for path in train_label_list:
    print(path)
    f = open(path, "rt") 
    person = []
    for line in f:
      if line.startswith("48"):
        person.append(line)
    f.close()
    if len(person) == 0 : # person 이 없으면 삭제한다 
      os.remove(path)
      os.remove(path.replace(".txt", ".jpg").replace("/labels/","/images/"))
    else : 
      f2 = open(path, 'wt')
      for p in person:
        f2.write(p.replace("48","0",1))
      f2.close()
      
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Hyper params')

    parser.add_argument('--root', type=str, default="./",
                        help='where root')

    args = parser.parse_args()
    
    inference(args.root)