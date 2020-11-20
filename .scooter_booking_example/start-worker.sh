trap 'kill %1; kill %2; kill %3; kill %4' SIGINT
../zbctl/zbctl --insecure create worker check_payment --handler cat &
../zbctl/zbctl --insecure create worker cancel_scooter --handler cat &
../zbctl/zbctl --insecure create worker rejection_mail --handler cat &
../zbctl/zbctl --insecure create worker book_scooter --handler cat &
../zbctl/zbctl --insecure create worker success_mail --handler cat